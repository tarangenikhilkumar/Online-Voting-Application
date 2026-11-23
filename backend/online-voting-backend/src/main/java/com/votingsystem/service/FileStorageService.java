package com.votingsystem.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.votingsystem.exception.BadRequestException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileStorageService {

    private static final String URL_PREFIX = "/uploads/";
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp");

    private final Path root;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create upload directory: " + root, ex);
        }
    }

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image to upload");
        }

        String extension = ALLOWED_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new BadRequestException("Only JPG, PNG or WEBP images are allowed");
        }

        try {
            byte[] bytes = file.getBytes();
            if (!hasValidSignature(bytes, extension)) {
                throw new BadRequestException("The uploaded file is not a valid image");
            }

            String fileName = UUID.randomUUID() + extension;
            Files.write(root.resolve(fileName), bytes);
            return URL_PREFIX + fileName;
        } catch (IOException ex) {
            log.error("Could not store uploaded file", ex);
            throw new BadRequestException("Could not save the image. Please try again.");
        }
    }

    public void delete(String url) {
        if (url == null || !url.startsWith(URL_PREFIX)) {
            return;
        }

        try {
            Path target = root.resolve(url.substring(URL_PREFIX.length())).normalize();
            if (target.startsWith(root)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ex) {
            log.warn("Could not delete file {}", url, ex);
        }
    }

    private boolean hasValidSignature(byte[] bytes, String extension) {
        if (bytes.length < 12) {
            return false;
        }
        return switch (extension) {
            case ".jpg" -> (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF;
            case ".png" -> (bytes[0] & 0xFF) == 0x89 && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G';
            case ".webp" -> new String(bytes, 0, 4, StandardCharsets.US_ASCII).equals("RIFF")
                    && new String(bytes, 8, 4, StandardCharsets.US_ASCII).equals("WEBP");
            default -> false;
        };
    }
}