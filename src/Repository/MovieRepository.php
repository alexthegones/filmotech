<?php

namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Movie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Movie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Movie[]    findAll()
 * @method Movie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    public function allMovies(): array
    {
        return $this->createQueryBuilder('m')
            ->orderBy('m.added_at','DESC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @param $string
     * @return Movie[] Returns an array of Movie objects
     */

    public function findByMovieName($string): array
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.name LIKE :query')
            ->setParameter('query', "%" . $string . "%")
            ->orderBy('q.release_at', 'ASC')
//            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
            ;
    }

    /*
    public function findOneBySomeField($value): ?Movie
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}