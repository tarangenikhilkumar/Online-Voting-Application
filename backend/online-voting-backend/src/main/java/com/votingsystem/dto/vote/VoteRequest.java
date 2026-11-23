package com.votingsystem.dto.vote;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoteRequest {

    @NotNull(message = "Please select a candidate")
    private Long electionCandidateId;
}