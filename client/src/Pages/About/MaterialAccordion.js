import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginLeft: '6vw',
  },
  heading: {
    fontSize: '1.3vw',
    fontWeight: theme.typography.fontWeightRegular,
    color: 'white'
  },
  base: {
    background: '#142537',
    borderBottom: '1.2px solid #E8CA5A',
  },
  details: {
    color: 'white',
    borderTop: '1.2px solid #E8CA5A',
    padding: '2.5vh'
  },
  detailText: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }
}));

export default function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Who can use Carpool?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            Carpool was created for the Rice University Community. A Net ID is required.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Do I need to download Carpool on my phone?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            No, Carpool is not a mobile device app. It was created as website to be accessible through all devices including desktop computers.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>How do I sign up for Carpool?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            No sign up is necessary! All you need is your Rice Net ID to log onto the site: carpool.riceapps.org
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>I’ve signed in for the first time, now what?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            Fill out your profile page with your first name, last name, and phone number. Now you can join and create rides!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>How do I see my past and future rides?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            You can find the rides you’ve taken in the past and the rides you’ve scheduled listed on your profile.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>If I leave a ride, will the ride disappear?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
          If you created a ride and were the only one on the ride, the ride will be deleted. If you joined a ride with other existing riders, the ride will exist but you will not be listed as a rider.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Is my information shared with outside parties?</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
          No, your information is not shared outside the application. It is only used for coordinating rides with your fellow Rice Owls.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
