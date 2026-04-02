package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Movie;
import com.mecinema.mecinema.model.enumtype.MovieStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    Page<Movie> findByStatus(MovieStatus status, Pageable pageable);
}

