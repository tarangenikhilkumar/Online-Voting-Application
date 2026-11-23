package com.votingsystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @EntityGraph(attributePaths = { "user" })
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("delete from RefreshToken t where t.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}