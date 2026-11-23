package com.votingsystem.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.votingsystem.entity.AuditLog;
import com.votingsystem.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(Long userId, String action, String details) {
        try {
            auditLogRepository.save(AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .details(details)
                    .ipAddress(currentIp())
                    .build());
        } catch (Exception ex) {
            log.error("Could not write audit log for action {}", action, ex);
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getLogs(String search, Pageable pageable) {
        return auditLogRepository.searchLogs(search, pageable);
    }

    private String currentIp() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs) {
            return attrs.getRequest().getRemoteAddr();
        }
        return null;
    }
}