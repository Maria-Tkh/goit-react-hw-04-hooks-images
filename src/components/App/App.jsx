import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchImages } from '../../services/api';
import { Searchbar } from '../Searchbar/Searchbar';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { Spinner } from '../Loader/Loader';
import './App.css';

export const App = () => {
  const [imageTags, setImageTags] = useState('');
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState([]);
  const [requestStatus, setRequestStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');

  //Делаем запись в state

  const handleFormSubmit = imageTags => {
    setPage(1);
    setGallery([]);
    setImageTags(imageTags);
  };

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  // Управление модалкой

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectedImage = (largeImageURL, imageTags) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);
    toggleModal();
  };

  const handleScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Реакция на изменение state, делаем запросы

  useEffect(() => {
    async function getGallery() {
      try {
        if (imageTags === '') return;
        setRequestStatus('pending');
        const gallery = await fetchImages(imageTags, page);
        setGallery(prevState => [...prevState, ...gallery]);
        setRequestStatus('resolved');
        handleScroll();
        if (gallery.length === 0) {
          return toast('Sorry, there are no images matching your search query. Please try again.');
        }
      } catch (error) {
        setRequestStatus('rejected');
        console.log(error);
      }
    }
    getGallery();
  }, [imageTags, page]);

  const isLoading = requestStatus === 'pending';
  const showGallery = gallery.length > 0 && !isLoading;

  return (
    <div>
      {showModal && <Modal onClose={toggleModal} largeImageURL={largeImageURL} alt={tags} />}
      <Searchbar onSearch={handleFormSubmit} />
      {isLoading && <Spinner />}
      <ImageGallery gallery={gallery} handleSelectedImage={handleSelectedImage} />
      {showGallery && <Button handleLoadMore={handleLoadMore} />}
      <Toaster position="top-right" />
    </div>
  );
};
