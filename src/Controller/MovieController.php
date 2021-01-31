<?php

namespace App\Controller;

use App\Entity\Movie;
use App\Form\MovieType;
use App\Repository\MovieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MovieController extends AbstractController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/", name="movie_home")
     * @param MovieRepository $movies
     * @return Response
     */
    public function home(MovieRepository $movies): Response
    {
        return $this->render('home.html.twig', [
            'movies' => $movies->allMovies()
        ]);
    }

    /**
     * @Route("/movie/new", name="movie_create", methods={"POST"})
     * @Route("/movie/edit/{id}", name="movie_show")
     * @param Movie|null $movie
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function form(Movie $movie = null, Request $request)
    {
        if (!$movie) {
            $movie = new Movie();
        }

        $form = $this->createForm(MovieType::class, $movie);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // * Edition
            if ($movie->getId() !== null) {
                $this->addFlash('info', "Le film {$movie->getName()} a bien été modifié !");
                $this->em->flush();
            } else {
                // * Insertion
                $this->em->persist($movie);
                $this->em->flush();
                $this->addFlash('success', "Le film {$movie->getName()} a bien été ajouté !");
            }

            return $this->redirectToRoute('movie_home');
        }

        return $this->render('movie/create.html.twig', [
            'formMovie' => $form->createView(),
            'movie' => $movie,
            'editMovie' => $movie->getId() !== null,

        ]);
    }

    /**
     * @Route("/movie/delete/{id}", name="movie_delete")
     * @param Movie $movie
     * @return RedirectResponse
     */
    public function delete(Movie $movie): RedirectResponse
    {
        $this->em->remove($movie);
        $this->em->flush();
        $this->addFlash('error', "{$movie->getName()} supprimé !");

        return $this->redirectToRoute('movie_home');
    }

    /**
     * @Route("/search/{query}", name="movie_search_request", methods={"POST", "GET"})
     * @param MovieRepository $repo
     * @param Request $request
     * @return Response
     */
    public function handleSearchRequest(MovieRepository $repo, $query = null, Request $request): Response
    {
        $value = $request->get('query');
        if (!empty($value)) {
            $movies = $repo->findByMovieName($value);
            return new JsonResponse([
                'content' => $this->renderView(
                    'filter.html.twig', ['movies' => $movies]
                )
            ]);
        } else {
            $movies = $repo->allMovies();
        }
        return $this->render('home.html.twig', [
            'movies' => $movies
        ]);
    }

    /**
     * @Route("/movie/search", name="movie_search_api")
     */
    public function search(): Response
    {

        return $this->render('movie/search.html.twig');
    }

    /**
     * @Route("/movie/search/{name}", name="movie_search_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function searchAddMovie(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $title = $data['titre'];
        $synopsis = $data['description'];
        $poster = $data['affiche'];
        $release_at = $data['sortie'];

        $movie = $this->getDoctrine()->getRepository(Movie::class)->findOneBy(['name' => $title]);
        if (!$movie) {
            $movie = new Movie();
            $movie->setName($title);
            $movie->setPoster($poster);
            $movie->setSynopsis($synopsis);
            $movie->setReleaseAt(new \DateTime($release_at));
            $movie->setAddedAt(new \DateTime());
            $this->em->persist($movie);
            $this->em->flush();
        } else {
            throw new Exception("Le film existe deja dans la base de donnée");
        }

        return new JsonResponse(['message' => 'Ajout du film effectué!'], 200);
    }
}
