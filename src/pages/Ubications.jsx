import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Ubications = () => {
  const [ubications, setUbications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openUbication, setOpenUbication] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/stores/${
        import.meta.env.VITE_STORE_ID
      }/ubications?limit=100`;
      const response = await axios.get(url);
      setUbications(response.data.ubications);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching ubications');
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedUbications = [...ubications];
    const ubicationIndex = updatedUbications.findIndex(
      (ubication) => ubication._id === openUbication,
    );

    const items = [...updatedUbications[ubicationIndex].detail];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updatedUbications[ubicationIndex].detail = items;
    setUbications(updatedUbications);

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/ubications/${openUbication}/re-order`,
        { detail: items },
        //  {
        //    headers: { Authorization: `Bearer ${accessToken}` },
        //  },
      );
      toast.success('Orden guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el nuevo orden:', error);
      toast.error('Error al guardar el nuevo orden');
    }
  };

  const handleToggleUbication = (ubicationId) => {
    setOpenUbication((prev) => (prev === ubicationId ? null : ubicationId));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {ubications?.map((ubication) => (
            <React.Fragment key={ubication._id}>
              <ListItem
                button
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  mb: 2,
                  borderColor: 'divider',
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              >
                <ListItemText
                  primary={ubication.name.concat(
                    `: Total productos: ${ubication.totalQuantity}`,
                  )}
                  sx={{ pr: 2 }}
                />

                {openUbication === ubication._id ? (
                  <ExpandLessIcon
                    color='secondary'
                    onClick={() => handleToggleUbication(ubication._id)}
                  />
                ) : (
                  <ExpandMoreIcon
                    color='secondary'
                    onClick={() => handleToggleUbication(ubication._id)}
                  />
                )}
              </ListItem>
              <Collapse in={openUbication === ubication._id} timeout='auto'>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId='list'>
                    {(provided) => (
                      <List
                        component='div'
                        disablePadding
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {ubication.detail.map((item, index) => (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided) => (
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ pl: 4 }}
                              >
                                <ListItemIcon>
                                  <Avatar
                                    src={item.product?.image}
                                    alt={item.product?.name}
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.product?.name}
                                  secondary={`Cantidad: ${item.quantity}`}
                                  primaryTypographyProps={{ color: 'primary' }}
                                />
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </List>
                    )}
                  </Droppable>
                </DragDropContext>

                <Divider sx={{ my: 2 }} />
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Snackbar para mensajes */}
    </Box>
  );
};

export default Ubications;
