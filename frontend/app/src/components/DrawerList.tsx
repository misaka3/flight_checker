import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRouter } from 'next/router';

interface CustomListProps {
  open: boolean;
}

const CustomList: React.FC<CustomListProps> = ({ open }) => {
  const router = useRouter();

  const items = [
    { name: 'エリア一覧', path: '/areas', icon: 'PlaceIcon' },
    { name: 'タスクタイプ一覧', path: '/task_type_all', icon: 'DoneAllIcon' },
  ];

  const handleClick = (path: string) => {
    router.push(path);
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'PlaceIcon':
        return <PlaceIcon />;
      case 'DoneAllIcon':
        return <DoneAllIcon />;
      default:
        return null;
    }
  };

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleClick(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {renderIcon(item.icon)}
            </ListItemIcon>
            <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default CustomList;
