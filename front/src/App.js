import React, { useState } from 'react';
import axios from 'axios'
import { BASE_URL } from './const';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { TextField, Button, Box, ListItemText, ListItem, List, IconButton, ListItemButton, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [htmlInput, setHtmlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [idModel, setIdModel] = useState('');
  const [pdfData, setPdfData] = useState(null);
  
  const getSavedModels = () => {
    const savedModels = JSON.parse(localStorage.getItem('models')) || []
    return savedModels;
  };

  const [models, setModels] = useState(getSavedModels());

  const saveInStorage = () => {
    const savedModels = JSON.parse(localStorage.getItem('models')) || [];
    const modelId = Date.now().toString();
    savedModels.push({id: modelId, html: htmlInput, name: nameInput})
    localStorage.setItem('models', JSON.stringify(savedModels));
    setModels(getSavedModels())
  }

  const handleHtmlInputChange = (e) => {
    setHtmlInput(e.target.value);
  };

  const handleNameInputChange = (e) => {
    setNameInput(e.target.value);
  };

  const selectModel = (modelId) => {
    let find = models.find((element) => element.id === modelId)
    if(find !== undefined){
      setHtmlInput(find.html)
      setIdModel(find.modelId)
    }
  }

  const convertHtmlToPdf = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/html-to-pdf`, { html: htmlInput }, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfData(url);
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
    }
  };  
  
  return (
    <Box display="flex" gap={8} p={2}>
      <Box display="flex" flexDirection="column" gap={2}>
        <h2>Mes modèles</h2>
        {models.length > 0 ? (
          <List>
            {models.map((element) => (
              <ListItem>
                <ListItemButton
                  selected={idModel === element.id}
                  onClick={() => selectModel(element.id)}
                >
                  <ListItemText
                    primary={element.name}
                  />
                </ListItemButton>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ): <p>Aucun modèle d'enregistrer</p>}
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <h2>Conversion en PDF</h2>
        <textarea
          placeholder="Entrer le code html ici"
          value={htmlInput}
          onChange={handleHtmlInputChange}
          rows="10"
          cols="50"
        ></textarea>
        <Button variant="contained" onClick={convertHtmlToPdf}>Convertir en PDF</Button>
        <Box display="flex" gap={4}>
          <TextField variant="outlined" label="Nom" value={nameInput} onChange={handleNameInputChange} />
          <Button variant="contained" onClick={saveInStorage}>Enregistrer</Button>
        </Box>
      </Box>
      <br />
      {pdfData && (
        <div>
          <h2>Résultat</h2>
          <a href={pdfData} download="export.pdf">
            Télécharger
          </a>
          <embed src={pdfData} type="application/pdf" width="100%" height="500px" />
        </div>
      )}
    </Box>
  );
}

export default App;
