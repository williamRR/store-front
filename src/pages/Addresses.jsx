import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

// Subcomponente para centrar el mapa cuando cambian las coordenadas
const MapUpdater = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 16); // Ajusta el zoom y las coordenadas
    }
  }, [coordinates, map]);
  return null;
};

const Addresses = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [coordinates, setCoordinates] = useState([51.505, -0.09]); // Coordenadas por defecto
  const [submittedData, setSubmittedData] = useState(null);
  const [addressList, setAddressList] = useState([]); // Lista de direcciones guardadas
  const [editingIndex, setEditingIndex] = useState(null); // Índice de edición
  const { currentUser } = useAuth(); // Obtener el ID del usuario autenticado
  console.log({ currentUser });

  // Obtener coordenadas desde la API de OpenStreetMap
  const getCoordinatesFromAddress = async (address) => {
    try {
      const respo = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address,
        )}&format=json&limit=1`,
      );
      if (respo.data && respo.data.length > 0) {
        const { lat, lon } = respo.data[0]; // Extraer latitud y longitud de la respuesta
        return [parseFloat(lat), parseFloat(lon)]; // Retornar las coordenadas como números
      } else {
        console.error('No se encontraron coordenadas para esta dirección');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  };

  // Obtener todas las direcciones del usuario desde el backend
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${currentUser._id}/addresses`,
      );
      setAddressList(response.data); // Establecer las direcciones recibidas desde el backend
    } catch (error) {
      console.error('Error al obtener las direcciones:', error);
    }
  };

  // Enviar el formulario para crear o actualizar una dirección
  const onSubmit = async (data) => {
    const address = `${data.street} ${data.number}, ${data.city}, ${data.region}`;
    const coords = await getCoordinatesFromAddress(address);

    if (coords) {
      setCoordinates(coords);
      setSubmittedData(data);

      const url = `${import.meta.env.VITE_API_URL}/users/${
        currentUser._id
      }/addresses`;

      try {
        if (editingIndex !== null) {
          // Editar dirección existente
          const addressToEdit = addressList[editingIndex];
          const editUrl = `${url}/${addressToEdit._id}`;
          await axios.patch(editUrl, {
            ...data,
            coordinates: { lat: coords[0], lon: coords[1] }, // Enviar como objeto { lat, lon }
          });

          // Actualizar la lista local
          const updatedList = [...addressList];
          updatedList[editingIndex] = {
            ...data,
            coordinates: { lat: coords[0], lon: coords[1] }, // Actualizar en el estado local
          };
          setAddressList(updatedList);
          setEditingIndex(null); // Resetear el estado de edición
        } else {
          // Crear una nueva dirección
          const response = await axios.post(url, {
            ...data,
            coordinates: { lat: coords[0], lon: coords[1] }, // Enviar como objeto { lat, lon }
          });
          setAddressList(response.data); // Actualizar la lista con la nueva dirección
        }

        reset(); // Limpiar el formulario
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }
  };

  // Manejar la edición de una dirección
  const handleEdit = (index) => {
    const addressToEdit = addressList[index];
    reset(addressToEdit); // Cargar los datos de la dirección en el formulario
    setEditingIndex(index); // Marcar el índice de la dirección en edición
    setCoordinates(addressToEdit.coordinates); // Centramos el mapa en la dirección seleccionada
  };

  // Manejar la eliminación de una dirección
  const handleDelete = async (index) => {
    const addressToDelete = addressList[index];
    const url = `${import.meta.env.VITE_API_URL}/users/${_id}/addresses/${
      addressToDelete._id
    }`;

    try {
      await axios.delete(url); // Eliminar la dirección del backend
      const updatedList = addressList.filter((_, i) => i !== index); // Actualizar la lista local
      setAddressList(updatedList);
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
    }
  };

  // Obtener direcciones al cargar el componente
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Manage Addresses
      </Typography>

      {/* Listado de direcciones guardadas */}
      {addressList.length > 0 && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
          <Typography variant='h6' gutterBottom>
            Saved Addresses
          </Typography>
          <List>
            {addressList.map((address, index) => (
              <ListItem
                key={index}
                button
                onClick={() => setCoordinates(address.coordinates)}
              >
                <ListItemText
                  primary={`${address.street} ${address.number}, ${address.city}, ${address.region}`}
                  secondary={address.comment}
                />
                <ListItemSecondaryAction>
                  <IconButton edge='end' onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge='end'
                    onClick={() => handleDelete(index)}
                    sx={{ marginLeft: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Street'
              fullWidth
              {...register('street', { required: 'Street is required' })}
              error={!!errors.street}
              helperText={errors.street?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Number'
              fullWidth
              {...register('number', { required: 'Number is required' })}
              error={!!errors.number}
              helperText={errors.number?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='City'
              fullWidth
              {...register('city', { required: 'City is required' })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Region'
              fullWidth
              {...register('region', { required: 'Region is required' })}
              error={!!errors.region}
              helperText={errors.region?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Apartment/Department (optional)'
              fullWidth
              {...register('apartment')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Comment (optional)'
              fullWidth
              {...register('comment')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type='submit' variant='contained' fullWidth>
              {editingIndex !== null ? 'Update Address' : 'Add Address'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Mapa de previsualización */}
      {submittedData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h6' gutterBottom>
            Preview Address
          </Typography>
          <MapContainer
            center={coordinates}
            zoom={16}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={coordinates} />
            <MapUpdater coordinates={coordinates} />
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default Addresses;
