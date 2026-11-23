package com.votingsystem.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.Election;
import com.votingsystem.entity.enums.ElectionStatus;

@Repository
public interface ElectionRepository extends JpaRepository<Election, Long> {

    Page<Election> findByStatus(ElectionStatus status, Pageable pageable);

    long countByStatus(ElectionStatus status);

    List<Election> findByStatusOrderByEndDateAsc(ElectionStatus status);

    List<Election> findTop5ByOrderByCreatedAtDesc();

    List<Election> findByStatusAndStartDateLessThanEqual(ElectionStatus status, LocalDateTime time);

    List<Election> findByStatusAndEndDateLessThanEqual(ElectionStatus status, LocalDateTime time);
}