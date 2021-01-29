<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Movie;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CommentController extends AbstractController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/movie/comment/{id}", name="movie_comment")
     * @param Movie $movie
     * @param Comment|null $comment
     * @param Request $request
     * @param CommentRepository $comments
     */
    public function create(Movie $movie, Comment $comment = null, Request $request, CommentRepository $comments): Response
    {
        $comment = new Comment();

        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $comment->setMovie($movie);
            $this->em->persist($comment);
            $this->em->flush();
//            $this->addFlash('success', "Le commentaire a bien été ajouté !");

        }
        return $this->render('comment/create.html.twig', [
            'formComment' => $form->createView(),
            'movie' => $movie,
            'comments' => $comments->findAll()
        ]);
    }
}