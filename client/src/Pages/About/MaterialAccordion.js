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

const SimpleAccordion = ({title, children}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.base}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography className={classes.detailText}>
            {children}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default SimpleAccordion;
