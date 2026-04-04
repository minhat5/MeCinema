package com.mecinema.mecinema.model.entity;

import com.mecinema.mecinema.model.enumtype.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@NamedEntityGraphs({
        @NamedEntityGraph(
                name = "Booking.withDetails",
                attributeNodes = {
                        @NamedAttributeNode(value = "showtime", subgraph = "showtimeDetails"),
                        @NamedAttributeNode(value = "tickets", subgraph = "ticketDetails"),
                        @NamedAttributeNode(value = "bookingFoods", subgraph = "bookingFoodDetails")
                },
                subgraphs = {
                        @NamedSubgraph(name = "showtimeDetails", attributeNodes = {
                                @NamedAttributeNode("movie"),
                                @NamedAttributeNode(value = "room", subgraph = "roomDetails")
                        }),
                        @NamedSubgraph(name = "roomDetails", attributeNodes = {
                                @NamedAttributeNode("cinema")
                        }),
                        @NamedSubgraph(name = "ticketDetails", attributeNodes = {
                                @NamedAttributeNode("seat")
                        }),
                        @NamedSubgraph(name = "bookingFoodDetails", attributeNodes = {
                                @NamedAttributeNode("food")
                        })
                }
        ),
        @NamedEntityGraph(
                name = "Booking.summary",
                attributeNodes = {
                        @NamedAttributeNode(value = "showtime", subgraph = "showtimeSummary")
                },
                subgraphs = {
                        @NamedSubgraph(name = "showtimeSummary", attributeNodes = {
                                @NamedAttributeNode("movie"),
                                @NamedAttributeNode(value = "room", subgraph = "roomSummary")
                        }),
                        @NamedSubgraph(name = "roomSummary", attributeNodes = {
                                @NamedAttributeNode("cinema")
                        })
                }
        ),
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime = LocalDateTime.now();

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookingFood> bookingFoods = new ArrayList<>();
}
