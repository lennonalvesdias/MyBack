import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomTable from './CustomTable';

interface CanvasItem {
    id: string;
    type: string;
    name: string;
    left: number;
    top: number;
    apiUrl?: string;
    columns?: Array<{ id: string; label: string }>;
}

interface CanvasItemComponentProps {
    item: CanvasItem;
    moveItem: (id: string, left: number, top: number) => void;
    deleteItem: (id: string) => void;
    updateItem: (id: string, updates: any) => void;
}

const CanvasItemComponent: React.FC<CanvasItemComponentProps> = ({ item, moveItem, deleteItem, updateItem }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localApiUrl, setLocalApiUrl] = useState(item.apiUrl || '');
    const [localColumns, setLocalColumns] = useState(item.columns || []);

    const [, drag] = useDrag({
        type: item.type,
        item: { ...item },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        end: (draggedItem: any, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (delta) {
                moveItem(draggedItem.id, Math.round(draggedItem.left + delta.x), Math.round(draggedItem.top + delta.y));
            }
        },
    });

    const handleOpenEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        updateItem(item.id, { apiUrl: localApiUrl, columns: localColumns });
        setIsEditing(false);
    };

    const handleChangeApiUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalApiUrl(event.target.value);
    };

    const handleAddColumn = () => {
        setLocalColumns([...localColumns, { id: '', label: '' }]);
    };

    const handleColumnChange = (index: any, field: any, value: any) => {
        const updatedColumns = localColumns.map((col, i) => {
            if (i === index) {
                return { ...col, [field]: value };
            }
            return col;
        });
        setLocalColumns(updatedColumns);
    };

    const handleRemoveColumn = (index: any) => {
        setLocalColumns(localColumns.filter((_, i) => i !== index));
    };

    const renderColumnFields = () => (
        localColumns.map((col, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                    label="Column ID"
                    value={col.id}
                    onChange={(e) => handleColumnChange(index, 'id', e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="Column Label"
                    value={col.label}
                    onChange={(e) => handleColumnChange(index, 'label', e.target.value)}
                />
                <IconButton onClick={() => handleRemoveColumn(index)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        ))
    );

    const renderEditDialog = () => (
        <Dialog open={isEditing} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Table Settings</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="apiUrl"
                    label="API URL"
                    type="text"
                    fullWidth
                    value={localApiUrl}
                    onChange={handleChangeApiUrl}
                />
                {renderColumnFields()}
                <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddColumn} color="primary">
                    Add Column
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEdit} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderComponent = () => {
        switch (item.type) {
            case 'button':
                return (
                    <Button variant="contained" color="primary" onClick={() => deleteItem(item.id)}>
                        {item.name}
                    </Button>
                );
            case 'table':
                return (
                    <Paper elevation={3}>
                        <CustomTable apiUrl={item.apiUrl || 'default-url'} columns={item.columns || [{ id: 'default', label: 'Default' }]} />
                        <Button variant="contained" color="primary" onClick={handleOpenEdit}>Edit</Button>
                        <Button variant="contained" color="error" onClick={() => deleteItem(item.id)}>Delete</Button>
                        {renderEditDialog()}
                    </Paper>
                );
            default:
                return <div>Unknown item type</div>;
        }
    };

    return (
        <div ref={drag} key={item.id} style={{ position: 'absolute', left: item.left, top: item.top }}>
            {renderComponent()}
        </div>
    );
};

export default CanvasItemComponent;
