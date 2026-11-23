package com.votingsystem.dto.candidate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApplicationRequest {

    @NotNull(message = "Election is required")
    private Long electionId;
}