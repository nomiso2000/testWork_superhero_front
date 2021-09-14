import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Link, useParams, useHistory } from 'react-router-dom';
import routes from '../routes';
import '../styles.css';
function Hero() {
  const { id } = useParams();
  const history = useHistory();
  const [images, setImages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [realName, setRealName] = useState('');
  const [originDescription, setOriginDescription] = useState('');
  const [superpowers, setSuperpowers] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
  const [file, setFile] = useState();
  useEffect(() => {
    async function fetchData() {
      const result = await axios(`http://localhost:8000/hero/${id}`);
      console.log(result.data);
      result?.data.images.map(async (el) => {
        await axios(`http://localhost:8000/image/${el}`, {
          responseType: 'arraybuffer',
        }).then((response) => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          let finalRes = 'data:;base64,' + base64;

          setImages((res) => [
            ...res,
            {
              id: result.data._id,
              name: el,
              image: finalRes,
            },
          ]);
        });
      });

      setNickname(result.data.nickname);
      setRealName(result.data.real_name);
      setOriginDescription(result.data.origin_description);
      setSuperpowers(result.data.superpowers);
      setCatchPhrase(result.data.catch_phrase);
    }
    fetchData();
  }, []);
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'nickname':
        return setNickname(e.target.value);
      case 'realName':
        return setRealName(e.target.value);
      case 'originDescription':
        return setOriginDescription(e.target.value);
      case 'superpowers':
        return setSuperpowers(e.target.value);
      case 'catchPhrase':
        return setCatchPhrase(e.target.value);
      default:
        console.log('default');
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      await axios.post('http://localhost:8000/upload', data);
      await axios.patch(`http://localhost:8000/${id}`, {
        nickname,
        real_name: realName,
        origin_description: originDescription,
        superpowers,
        catch_phrase: catchPhrase,
        images: [file.name],
      });
    } else {
      await axios.patch(`http://localhost:8000/${id}`, {
        nickname,
        real_name: realName,
        origin_description: originDescription,
        superpowers,
        catch_phrase: catchPhrase,
      });
    }
    window.location.reload();
  };
  const deleteImg = async (imgName) => {
    console.log(imgName);
    await axios.patch(`http://localhost:8000/${id}`, {
      imgName,
    });
  };
  const deleteHero = async () => {
    await axios.delete(`http://localhost:8000/${id}`);
    history.push(routes.HOME.path);
  };
  return (
    <div>
      <Link
        className="link_to_home"
        to={{
          pathname: '/home',
          search: `?page=1`,
        }}
      >
        Home
      </Link>

      {images[0]?.image && (
        <>
          <form onSubmit={submitHandler}>
            {images.map((el, index) => {
              return (
                <>
                  <img src={el.image} height="400" width="400" key={index} />
                  <button
                    onClick={(e) => deleteImg(el.name)}
                    className={images.length === 1 ? 'disable' : 'button'}
                  >
                    Удалить фото
                  </button>
                </>
              );
            })}
            <br />
            <label for="images" className="shareOption">
              Добавить фото героя
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <br />
            <label for="nickname">Назва героя</label>
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleChange}
            />
            <br />
            <label for="realName">Справжнє ім'я героя</label>
            <input
              id="realName"
              type="text"
              name="realName"
              value={realName}
              onChange={handleChange}
            />
            <br />
            <label for="originDescription">Опис</label>
            <textarea
              id="originDescription"
              type="text"
              name="originDescription"
              value={originDescription}
              onChange={handleChange}
              rows="5"
              cols="45"
            />
            <br />
            <label for="superpowers">Супер-сила</label>
            <textarea
              id="superpowers"
              type="text"
              name="superpowers"
              value={superpowers}
              onChange={handleChange}
              rows="5"
              cols="45"
            />
            <br />
            <label for="catchPhrase">Цитата</label>
            <input
              id="catchPhrase"
              type="text"
              name="catchPhrase"
              value={catchPhrase}
              onChange={handleChange}
            />
            <br />
            <button className="shareButton" type="submit">
              Update
            </button>
          </form>
          <button className="shareButton" type="button" onClick={deleteHero}>
            Delete Hero
          </button>
        </>
      )}
    </div>
  );
}

export default Hero;
