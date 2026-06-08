package org.atg.bems.service;

import org.atg.bems.postgresql.entity.Article;
import org.atg.bems.postgresql.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 게시글 관련 비즈니스 로직을 처리하는 클래스
 */

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Article createArticle(String title, String content){
        return articleRepository.save(Article.builder()
                        .title(title)
                        .content(content)
                .build());
    }

    public List<Article> readTop5Article(){
        return articleRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public List<Article> readAllArticle(){
        return articleRepository.findAll();
    }
    public Optional<Article> readArticleById(Long id){
        return articleRepository.findById(id);
    }

    public void deleteArticleById(Long id){
        articleRepository.deleteById(id);
    }

    //TODO : 필요시 업데이트 구현
}
