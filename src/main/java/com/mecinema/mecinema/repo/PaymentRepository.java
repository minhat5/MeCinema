package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findFirstByBookingIdOrderByCreatedAtDesc(Long bookingId);

    List<Payment> findByBookingIdInOrderByCreatedAtDesc(Collection<Long> bookingIds);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Payment> findByTransactionNo(String transactionNo);
}
