import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    // height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}))

export default function Loading({ height }) {
  const classes = useStyles()

  return (
    <div className={classes.wrapper} style={{ height }}>
      <div className={classes.root}>
        <CircularProgress />
      </div>
    </div>
  )
}
