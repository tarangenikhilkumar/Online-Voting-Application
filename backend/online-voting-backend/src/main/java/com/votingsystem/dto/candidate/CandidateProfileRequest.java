package com.votingsystem.dto.candidate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CandidateProfileRequest {

    @NotBlank(message = "Party name is required")
    @Size(max = 100, message = "Party name must be at most 100 characters")
    private String partyName;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;
}