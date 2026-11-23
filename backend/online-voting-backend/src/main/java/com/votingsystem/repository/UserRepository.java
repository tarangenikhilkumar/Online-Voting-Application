package com.votingsystem.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    @Query("""
            select u from User u
            where u.role = :role
              and (lower(u.fullName) like lower(concat('%', :keyword, '%'))
                   or lower(u.email) like lower(concat('%', :keyword, '%')))
            """)
    Page<User> searchByRole(@Param("role") Role role,
                            @Param("keyword") String keyword,
                            Pageable pageable);
}