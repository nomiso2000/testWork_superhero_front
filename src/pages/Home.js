import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import { Link, useLocation } from 'react-router-dom';
import '../styles.css';
function Home() {
  const [gettedData, setGettedData] = useState();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [a, setA] = useState([]);
  let location = useLocation();
  useEffect(() => {
    async function fetchData() {
      const result = await axios(`http://localhost:8000/?page=${getPage()}`);
      result.data.heroes.forEach(async (el) => {
        await axios(`http://localhost:8000/image/${el.images[0]}`, {
          responseType: 'arraybuffer',
        }).then((response) => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          let finalRes = 'data:;base64,' + base64;

          setA((res) => [
            ...res,
            {
              id: el._id,
              name: el.images,
              image: finalRes,
              nickname: el.nickname,
              createdAt: el.createdAt,
            },
          ]);
        });
      });
      setGettedData(result.data.heroes);
      setTotal(result.data.total);
    }
    fetchData();
  }, [currentPage]);
  const getPage = () => {
    return location.search.match(/(\d+)/);
  };

  return (
    <div className="App">
      <h1 className="header">SUPERHERO</h1>
      <Form></Form>
      <ul className="list">
        {' '}
        {a?.length >= 1
          ? a
              ?.sort((c, b) => {
                return new Date(c.createdAt) - new Date(b.createdAt);
              })
              .reverse()
              .map((el, index) => {
                return (
                  <li key={index} className="items">
                    {' '}
                    <Link
                      to={{
                        pathname: `/hero/${el.id}`,
                      }}
                    >
                      <img src={[el.image]} height="400" width="400" />
                      <span className="nickname">{el.nickname}</span>
                    </Link>
                  </li>
                );
              })
          : console.log(a, gettedData)}
      </ul>
      <Link
        className={currentPage === 1 ? 'disable' : 'active'}
        to={{
          pathname: '/home',
          search: `?page=${currentPage - 1}`,
        }}
        onClick={async () => {
          setCurrentPage(currentPage - 1);
          setA([]);
        }}
      >
        Previous Page
      </Link>
      <Link
        className={total <= currentPage * 5 ? 'disable' : 'active'}
        to={{
          pathname: '/home',
          search: `?page=${currentPage + 1}`,
        }}
        onClick={async () => {
          setCurrentPage(currentPage + 1);
          setA([]);
        }}
      >
        Next Page
      </Link>
    </div>
  );
}

export default Home;
