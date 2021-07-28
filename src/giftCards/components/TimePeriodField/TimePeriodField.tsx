import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { timePeriodTextWithSelectFieldMessages as messages } from "./messages";

interface TimePeriodFieldProps {
  change: FormChange;
  periodAmount: number;
  periodType: TimePeriodTypeEnum;
  amountFieldName: string;
  typeFieldName: string;
}

const TimePeriodField: React.FC<TimePeriodFieldProps> = ({
  change,
  periodAmount,
  periodType,
  amountFieldName,
  typeFieldName
}) => {
  const intl = useIntl();

  const options = [
    {
      label: intl.formatMessage(messages.yearLabel),
      value: TimePeriodTypeEnum.YEAR
    },
    {
      label: intl.formatMessage(messages.monthLabel),
      value: TimePeriodTypeEnum.MONTH
    },
    {
      label: intl.formatMessage(messages.dayLabel),
      value: TimePeriodTypeEnum.DAY
    }
  ];

  return (
    <TextWithSelectField
      choices={options}
      change={change}
      textFieldName={amountFieldName as string}
      selectFieldName={typeFieldName as string}
      textFieldValue={periodAmount}
      selectFieldValue={periodType}
    />
  );
};

export default TimePeriodField;