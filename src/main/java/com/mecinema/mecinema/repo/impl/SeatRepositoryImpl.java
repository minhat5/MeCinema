package com.mecinema.mecinema.repo.impl;

import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.repo.SeatRepositoryExtended;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public class SeatRepositoryImpl implements SeatRepositoryExtended {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Seat> findAllByIdForUpdate(Collection<Long> seatIds) {
        return entityManager.createQuery("select s from Seat s where s.id in :seatIds order by s.id", Seat.class)
                .setParameter("seatIds", seatIds)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getResultList();
    }
}
