package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByBookingIdIn(Collection<Long> bookingIds);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Payment> findByTransactionNo(String transactionNo);
}
