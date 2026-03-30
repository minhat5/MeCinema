package com.mecinema.mecinema.model.entity;

import com.mecinema.mecinema.model.enumtype.PaymentMethod;
import com.mecinema.mecinema.model.enumtype.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments", uniqueConstraints = {
        @UniqueConstraint(columnNames = "transaction_no")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_no", length = 100, unique = true)
    private String transactionNo;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
}
