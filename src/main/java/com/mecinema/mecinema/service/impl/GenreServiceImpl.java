package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.entity.Genre;
import com.mecinema.mecinema.repo.GenreRepository;
import com.mecinema.mecinema.service.GenreService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {
    private final GenreRepository genreRepository;

    @Override
    public Page<Genre> findAll(Pageable pageable) {
        return genreRepository.findAll(pageable);
    }

    @Override
    public Genre findById(Long id) {
        return genreRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thể loại với id: " + id));
    }

    @Override
    public Genre create(Genre genre) {
        if(genreRepository.existsByName(genre.getName())) {
            throw new IllegalArgumentException("Thể loại đã tồn tại với tên: " + genre.getName());
        }
        return genreRepository.save(genre);
    }

    @Override
    public Genre update(Long id, Genre genre) {
        Genre updatingGenre = genreRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thể loại với id: " + id));
        if(genre.getName().equals(updatingGenre.getName())) {
            throw new RuntimeException("Không có thay đổi nào được thực hiện");
        }
        if(genreRepository.existsByName(genre.getName())) {
            throw new IllegalArgumentException("Thể loại đã tồn tại với tên: " + genre.getName());
        }
        updatingGenre.setName(genre.getName());
        return genreRepository.save(updatingGenre);
    }

    @Override
    public void delete(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy thể loại với id: " + id);
        }
        genreRepository.deleteById(id);
    }

    @Override
    public Page<Genre> search(String keyword, Pageable pageable) {
        return genreRepository.findAll((root, query, criteriaBuilder) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern);
        }, pageable);
    }
}
