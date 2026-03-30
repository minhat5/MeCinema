package com.mecinema.mecinema.repo.impl;

import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.repo.ShowtimeRepositoryExtended;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Subgraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ShowtimeRepositoryImpl implements ShowtimeRepositoryExtended {

    private static final String LOAD_GRAPH_HINT = "jakarta.persistence.loadgraph";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Showtime> findWithDetailsById(Long id) {
        var query = entityManager.createQuery(
                "select s from Showtime s where s.id = :id",
                Showtime.class
        );
        query.setParameter("id", id);
        query.setHint(LOAD_GRAPH_HINT, showtimeGraph());
        return query.getResultStream().findFirst();
    }

    private EntityGraph<Showtime> showtimeGraph() {
        EntityGraph<Showtime> graph = entityManager.createEntityGraph(Showtime.class);
        graph.addAttributeNodes("movie", "room");
        Subgraph<?> roomGraph = graph.addSubgraph("room");
        roomGraph.addAttributeNodes("cinema");
        return graph;
    }
}
