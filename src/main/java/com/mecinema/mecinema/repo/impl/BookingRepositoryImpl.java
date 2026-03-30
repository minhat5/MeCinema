package com.mecinema.mecinema.repo.impl;

import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.repo.BookingRepositoryExtended;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepositoryImpl implements BookingRepositoryExtended {

    private static final String LOAD_GRAPH_HINT = "jakarta.persistence.loadgraph";
    private static final String BOOKING_DETAILS_GRAPH = "Booking.withDetails";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Booking> findByIdAndUserId(Long bookingId, Long userId) {
        var query = entityManager.createQuery(
                "select b from Booking b where b.id = :bookingId and b.user.id = :userId",
                Booking.class
        );
        query.setParameter("bookingId", bookingId);
        query.setParameter("userId", userId);
        query.setHint(LOAD_GRAPH_HINT, bookingDetailsGraph());
        return query.getResultStream().findFirst();
    }

    @Override
    public Page<Booking> findByUserIdOrderByBookingTimeDesc(Long userId, Pageable pageable) {
        var query = entityManager.createQuery(
                "select b from Booking b where b.user.id = :userId order by b.bookingTime desc",
                Booking.class
        );
        query.setParameter("userId", userId);
        query.setHint(LOAD_GRAPH_HINT, bookingDetailsGraph());
        query.setFirstResult(Math.toIntExact(pageable.getOffset()));
        query.setMaxResults(pageable.getPageSize());
        List<Booking> content = query.getResultList();

        Long total = entityManager.createQuery(
                "select count(b) from Booking b where b.user.id = :userId",
                Long.class
        ).setParameter("userId", userId).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }

    @SuppressWarnings("unchecked")
    private EntityGraph<Booking> bookingDetailsGraph() {
        return (EntityGraph<Booking>) entityManager.getEntityGraph(BOOKING_DETAILS_GRAPH);
    }
}
