package com.mecinema.mecinema.model.entity;

import com.mecinema.mecinema.model.enumtype.SeatType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "row_symbol", nullable = false, length = 10)
    private String rowSymbol;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private SeatType type = SeatType.NORMAL;
}
