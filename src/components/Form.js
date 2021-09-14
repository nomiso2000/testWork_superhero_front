import axios from 'axios';
import React, { useState } from 'react';

import '../styles.css';
function Form() {
  const [file, setFile] = useState(null);
  const [nickname, setNickname] = useState('');
  const [realName, setRealName] = useState('');
  const [originDescription, setOriginDescription] = useState('');
  const [superpowers, setSuperpowers] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
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
    if (
      nickname === '' ||
      realName === '' ||
      originDescription === '' ||
      superpowers === '' ||
      catchPhrase === '' ||
      file === null
    ) {
      alert('Ви заповнили не всі поля');
    } else if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      try {
        await axios.post('http://localhost:8000/upload', data);
        await axios.post('http://localhost:8000', {
          nickname,
          real_name: realName,
          origin_description: originDescription,
          superpowers,
          catch_phrase: catchPhrase,
          images: file.name,
        });
      } catch (err) {}
    }
    try {
      window.location.reload();
    } catch (err) {}
  };

  return (
    <form className="shareBottom" onSubmit={submitHandler}>
      <div className="shareOptions">
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
        <label for="images" className="shareOption">
          Фото героя
        </label>
        <input
          type="file"
          id="images"
          name="images"
          accept=".png,.jpeg,.jpg"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <button className="shareButton" type="submit">
        Отправить
      </button>
    </form>
  );
}

export default Form;
