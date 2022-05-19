import {MovieData} from 'types/movieData';
import {FavoriteSlice} from '../reducers/favoriteSlice';
import {AppDispatch} from '../store';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {storageLocal} from 'constants/common';
import {netInfo} from 'components/common/functions/internet';

export const addFavorite = (item: MovieData) => (dispatch: AppDispatch) => {
  dispatch(FavoriteSlice.actions.incrementFavorite(item));
};

export const deleteFavorite = (item: MovieData) => (dispatch: AppDispatch) => {
  dispatch(FavoriteSlice.actions.decrementFavorite(item));
};

export const setFavorite =
  (isLogin: boolean) => async (dispatch: AppDispatch) => {
    if (await netInfo()) {
      if (isLogin !== undefined) {
        firestore()
          .collection('Favorite')
          .doc(auth().currentUser?.uid)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              let result: any = documentSnapshot.data();
              if (result.favorite.length !== 0) {
                dispatch(
                  FavoriteSlice.actions.setFavoriteState(result.favorite),
                );
              } else {
                const json = storageLocal.getString('favorite');
                if (json !== undefined) {
                  const userObject = JSON.parse(json);
                  dispatch(FavoriteSlice.actions.setFavoriteState(userObject));
                }
              }
            } else {
              const json = storageLocal.getString('favorite');
              if (json !== undefined) {
                const userObject = JSON.parse(json);
                dispatch(FavoriteSlice.actions.setFavoriteState(userObject));
              }
            }
          });
      } else {
        const json = storageLocal.getString('favorite');
        if (json !== undefined) {
          const userObject = JSON.parse(json);
          dispatch(FavoriteSlice.actions.setFavoriteState(userObject));
        }
      }
    } else {
      const json = storageLocal.getString('favorite');
      if (json !== undefined) {
        const userObject = JSON.parse(json);
        dispatch(FavoriteSlice.actions.setFavoriteState(userObject));
      }
    }
  };
