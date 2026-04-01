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
    private static final String BOOKING_DETAIL_GRAPH = "Booking.withDetails";
    private static final String BOOKING_SUMMARY_GRAPH = "Booking.summary";

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

        query.setHint(LOAD_GRAPH_HINT, bookingDetailGraph());

        return query.getResultStream().findFirst();
    }

    @Override
    public Page<Booking> findByUserIdOrderByBookingTimeDesc(Long userId, Pageable pageable) {

        List<Long> ids = entityManager.createQuery(
                        "select b.id from Booking b where b.user.id = :userId order by b.bookingTime desc",
                        Long.class
                )
                .setParameter("userId", userId)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        if (ids.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<Booking> content = entityManager.createQuery(
                        "select b from Booking b where b.id in :ids order by b.bookingTime desc",
                        Booking.class
                )
                .setParameter("ids", ids)
                .setHint(LOAD_GRAPH_HINT, bookingSummaryGraph())
                .getResultList();

        Long total = entityManager.createQuery(
                        "select count(b) from Booking b where b.user.id = :userId",
                        Long.class
                )
                .setParameter("userId", userId)
                .getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }

    @SuppressWarnings("unchecked")
    private EntityGraph<Booking> bookingDetailGraph() {
        return (EntityGraph<Booking>) entityManager.getEntityGraph(BOOKING_DETAIL_GRAPH);
    }

    @SuppressWarnings("unchecked")
    private EntityGraph<Booking> bookingSummaryGraph() {
        return (EntityGraph<Booking>) entityManager.getEntityGraph(BOOKING_SUMMARY_GRAPH);
    }
}