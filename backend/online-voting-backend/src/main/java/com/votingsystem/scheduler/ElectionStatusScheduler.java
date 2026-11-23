package com.votingsystem.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.entity.Election;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.repository.ElectionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ElectionStatusScheduler {

    private final ElectionRepository electionRepository;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void updateElectionStatuses() {
        LocalDateTime now = LocalDateTime.now();

        List<Election> toStart =
                electionRepository.findByStatusAndStartDateLessThanEqual(ElectionStatus.UPCOMING, now);
        for (Election election : toStart) {
            election.setStatus(ElectionStatus.ACTIVE);
            log.info("Election '{}' is now ACTIVE", election.getTitle());
        }

        List<Election> toEnd =
                electionRepository.findByStatusAndEndDateLessThanEqual(ElectionStatus.ACTIVE, now);
        for (Election election : toEnd) {
            election.setStatus(ElectionStatus.COMPLETED);
            log.info("Election '{}' is now COMPLETED", election.getTitle());
        }
    }
}