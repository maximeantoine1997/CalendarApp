import MomentUtils from "@date-io/moment";
import { Box, Button, Dialog, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import { Calendar, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment, { Moment } from "moment";
import React, { useState } from "react";
import useCalendarContext from "../../../Contexts/CalendarContext";
import { Fauna, FDBgetReservations, FDBconvertToReservation, FDBUpdateReservationsAsync } from "../../../FaunaDB/Api";
import { HashMap } from "../../../Utils";
import { Reservation } from "../../reservation_form";


const useStyles = makeStyles(() => ({
    pointer: {
        cursor: "pointer",
    },
    calendar: {
        padding: "25px",
        minHeight: "50vh",
     },
}));

interface SettingsModalProps {
    /**
     * Boolean to see if the settings modal is open or not
     */
    open: boolean;

    /**
     * Closes the modal
     */
    onClose?: () => void;
}

const SettingsModal: React.FunctionComponent<SettingsModalProps> = ({ open, onClose }) => {
    const classes = useStyles();

    const {updateReservations} = useCalendarContext()


    const [date, setDate] = useState<Moment>(moment())
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

    const onChangeCalendar = (newDate: MaterialUiPickersDate) => {
        setCalendarOpen(false);
        setDate(newDate as Moment);
    };

    const onClick = async () => {
        const data: Array<Fauna<Reservation>> = (await FDBgetReservations([date.format("YYYY-MM-DD")])) as Array<
        Fauna<Reservation>
        >;

        if (!data) return;
        const hash: HashMap<Array<Reservation>> = {};
        // store all reservations in a hash
        data.forEach(async fReservation => {
        const reservation = FDBconvertToReservation(fReservation);
        const date = reservation.startDate;
        // add new element to existing array
        if (hash[date]) {
            const newHash = Array.from(hash[date]);
            newHash.push(reservation);
            hash[date] = newHash;
            return;
        }
        // hash has nothing stored yet so create array
        hash[date] = [reservation];
        });
        for (let date in hash) {
            const res = hash[date];
            for (let i = 0; i < res.length - 1; i++) {
                const currentReservation = res[i];
                const nextReservation = res[i + 1];
                let previousId = (currentReservation.id as unknown) as string;
                let nextId = (nextReservation.id as unknown) as string;
                if (!previousId || !nextId) return;
                // Asign next ID to current item
                res[i] = {
                    ...currentReservation,
                    next: nextId,
                };
                // Assign previous ID to the next item
                res[i + 1] = {
                    ...nextReservation,
                    previous: previousId,
                };
            }
            res[0] = { ...res[0], previous: "FIRST" };

            updateReservations(res)

            if (onClose) {
                onClose()
            }

        }

    };





    return <Dialog open={open} className={classes.calendar} maxWidth="sm" fullWidth >
                <Box minHeight="30vh">
                    <Grid container justify="space-evenly" alignItems="center" style={{height: "30vh"}}>
                        <Grid item >
                            <Typography variant="h6">
                             {date.format("DD-MM-YYYY")}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<InsertInvitationIcon />}
                                onClick={() => setCalendarOpen(true)}
                            >
                                Choisir Date
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={async () => await onClick()} variant="contained" color="primary">
                                    Fix date
                            </Button>
                        </Grid>
                    </Grid>



                    {calendarOpen &&
                        <Dialog open={calendarOpen}>
                            <MuiPickersUtilsProvider utils={MomentUtils} locale="fr">
                                <Calendar date={date} allowKeyboardControl onChange={onChangeCalendar} />
                            </MuiPickersUtilsProvider>
                        </Dialog>
                    }
                </Box>
        </Dialog>;

};

export default SettingsModal;
