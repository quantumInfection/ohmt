import React, { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Avatar, Box, Button, IconButton, Link, OutlinedInput, Stack, Tooltip, Typography } from '@mui/material';
import { PaperPlaneTilt as PaperPlaneTiltIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

const MessageInput = ({ user, onSend }) => {
  const [content, setContent] = useState(''); // State for the input content
  const [disabled, setDisabled] = useState(false); // State to control if input and button are disabled

  const handleChange = (event) => {
    setContent(event.target.value); // Update content state on input change
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' && content) {
      handleSend(); // Send message on Enter key press
    }
  };

  const handleSend = () => {
    onSend(content); // Call onSend function passed as prop
    setContent(''); // Clear input after sending
  };

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <OutlinedInput
        disabled={disabled}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Leave a message"
        sx={{ flex: '1 1 auto' }}
        value={content}
      />
      <Tooltip title="Send">
        <span>
          <IconButton
            color="primary"
            disabled={!content || disabled} // Disable button if content is empty or disabled
            onClick={handleSend}
            sx={{
              bgcolor: 'var(--mui-palette-primary-main)',
              color: 'var(--mui-palette-primary-contrastText)',
              '&:hover': { bgcolor: 'var(--mui-palette-primary-dark)' },
            }}
          >
            <PaperPlaneTiltIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

// Sample event data
const initialEvents = [
  {
    id: 'EV-005',
    createdAt: 'Oct 31, 05:47 PMsss',
    type: 'new_message',
    author: { name: 'Demo User', avatar: 'https://picsum.photos/500/300?random=1' },
    message: { content: 'This is a demo message.' },
  },
  {
    id: 'EV-003',
    createdAt: dayjs().subtract(18, 'minute').subtract(3, 'hour').subtract(5, 'day').toDate(),
    type: 'status',
    author: { name: 'Fran Perez', avatar: '/assets/avatar-5.png' },
    status: { name: 'Active' },
  },
  {
    id: 'EV-002',
    createdAt: dayjs().subtract(41, 'minute').subtract(5, 'hour').subtract(7, 'day').toDate(),
    type: 'location',
    author: { name: 'zeeshan Yan', avatar: '/assets/avatar-8.png' },
    location: { name: 'Cromwell, NZ' },
  },
  {
    id: 'EV-004',
    createdAt: dayjs().subtract(7, 'minute').subtract(5, 'hour').subtract(1, 'day').toDate(),
    type: 'new_job',
    author: { name: 'Jie Yan', avatar: '/assets/avatar-8.png' },
    job: { title: 'ILJFJK-400' },
  },
];

export default function TimelineBox() {
  const [events, setEvents] = useState(initialEvents); // State for managing events

  const handleSend = (messageContent) => {
    const newEvent = {
      id: `EV-${events.length + 1}`, // Simple ID generation for new event
      createdAt: new Date(), // Current timestamp
      type: 'new_message', // Set type for new message
      author: { name: 'You', avatar: '/path/to/your/avatar.png' }, // Set author info
      message: { content: messageContent }, // Store message content
    };

    setEvents((prevEvents) => [newEvent, ...prevEvents]); // Add new event to the start of the array
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h6">Activity</Typography>
      </div>
      <Stack spacing={3}>
        <MessageInput user={{ avatar: '/path/to/your/avatar.png' }} onSend={handleSend} />
        <Timeline
          sx={{
            m: 0,
            p: 0,
            '& .MuiTimelineItem-root': { '&::before': { display: 'none' } },
            '& .MuiTimelineDot-root': { background: 'transparent', border: 0, p: 0 },
            '& .MuiTimelineConnector-root': { minHeight: '30px' },
          }}
        >
          {events.map((event, index) => (
            <ActivityItem connector={index < events.length - 1} event={event} key={event.id} />
          ))}
        </Timeline>
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          <Button color="primary">Load more</Button>
        </Box>
      </Stack>
    </Stack>
  );
}

function ActivityItem({ event, connector }) {
  if (!event) {
    console.warn('Event is undefined');
    return null;
  }

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot>{event.author ? <Avatar src={event.author.avatar} /> : null}</TimelineDot>
        {connector ? <TimelineConnector /> : null}
      </TimelineSeparator>
      <TimelineContent>
        <ActivityContent event={event} />
        <Typography color="text.secondary" variant="caption">
          {dayjs(event.createdAt).format('MMM D, hh:mm A')}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

function ActivityContent({ event }) {
  if (!event || !event.type) return null;

  switch (event.type) {
    case 'new_job':
      return (
        <Typography variant="body2">
          <Typography component="span" variant="subtitle2">
            {event.author ? event.author.name : 'Unknown Author'}
          </Typography>{' '}
          linked a new job <Link variant="subtitle2">{event.job?.title || 'unknown job'}</Link>
        </Typography>
      );
      case 'status':
      return (
        <Typography variant="body2">
          <Typography component="span" variant="subtitle2">
            {event.author ? event.author.name : 'Unknown Author'}
          </Typography>{' '}
          changed the status to <Link variant="subtitle2">{event.status?.name || 'unknown job'}</Link>
        </Typography>
      ); 
      
      case 'location':
      return (
        <Typography variant="body2">
          <Typography component="span" variant="subtitle2">
            {event.author ? event.author.name : 'Unknown Author'}
          </Typography>{' '}
          changed the location to <Link variant="subtitle2">{event.location?.name || 'unknown job'}</Link>
        </Typography>
      );

    case 'new_message': // New case for displaying messages
      return (
        <Typography variant="body2">
          <Typography component="span" variant="subtitle2">
            {event.author ? event.author.name : 'Unknown Author'}
          </Typography>{' '}
          added a note
          <Box
            sx={{
              bgcolor: '#F9FAFB', 
              borderRadius: 1, 
              padding: 1, 
              mt: 1, 
              wordWrap: 'break-word', 
              whiteSpace: 'normal', 
            }}
          >
            <Typography component="span" variant="subtitle2">
              {event.message?.content || 'unknown message'}
            </Typography>
          </Box>
        </Typography>
      );

    default:
      return null;
  }
}
