import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import Money from "@saleor/components/Money";
import { useTheme } from "@saleor/macaw-ui";
import { isDarkTheme } from "@saleor/misc";
import classNames from "classnames";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardDetailsContext } from "../GiftCardDetailsProvider";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";
import { useGiftCardDetailsBalanceStyles as useStyles } from "./styles";

const GiftCardUpdateDetailsBalanceSection: React.FC = () => {
  const { themeType } = useTheme();
  const classes = useStyles({});
  const intl = useIntl();

  const {
    giftCard: { currentBalance, initialBalance }
  } = useContext(GiftCardDetailsContext);

  const progressBarWidth = !!currentBalance.amount
    ? Math.floor((currentBalance.amount / initialBalance.amount) * 100)
    : 0;

  return (
    <>
      <div
        className={classNames(classes.labelsContainer, classes.wideContainer)}
      >
        <Typography>{intl.formatMessage(messages.cardBalanceLabel)}</Typography>
        <div className={classes.labelsContainer}>
          <Money money={currentBalance} />
          <HorizontalSpacer />
          /
          <HorizontalSpacer />
          <Money money={initialBalance} />
        </div>
      </div>
      <CardSpacer />
      <div className={classes.balanceBar}>
        <div
          style={{ width: `${progressBarWidth}%` }}
          className={classNames(classes.balanceBarProgress, {
            [classes.balanceBarProgressDark]: isDarkTheme(themeType)
          })}
        />
      </div>
    </>
  );
};

export default GiftCardUpdateDetailsBalanceSection;