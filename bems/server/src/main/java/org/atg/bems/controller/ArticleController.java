package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.postgresql.entity.Article;
import org.atg.bems.service.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/article")
@CrossOrigin(origins = "http://localhost:3000")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping(value = "/all")
    @Operation(summary = "모든 게시물 조회")
    public List<Article> getAllArticle(){
        return articleService.readAllArticle();
    }
    
    @GetMapping(value = "/top-5")
    @Operation(summary = "상위 5개의 게시글 조회")
    public List<Article> getTop5Article(){
        return articleService.readTop5Article();
    }


    @GetMapping(value = "/{article-id}")
    @Operation(summary = "id를 통한 특정 게시글 조회")
    public Article getArticleById(@PathVariable(name = "article-id") Long id){
        return articleService.readArticleById(id).orElse(null);
    }

    @PostMapping(value = "/new")
    @Operation(summary = "게시글 생성")
    public Article createArticle(Article article){
        return articleService.createArticle(article.getTitle(), article.getContent());
    }

    @DeleteMapping(value = "/delete")
    @Operation(summary = "게시글 삭제")
    public ResponseEntity<Void> deleteArticle(Long id){
        articleService.deleteArticleById(id);
        return ResponseEntity.ok(null);
    }
}
