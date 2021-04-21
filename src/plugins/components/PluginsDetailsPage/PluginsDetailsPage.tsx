import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { PluginErrorFragment } from "@saleor/fragments/types/PluginErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import { isSecretField } from "@saleor/plugins/utils";
import { makeStyles } from "@saleor/theme";
import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { Plugin_plugin } from "../../types/Plugin";
import PluginAuthorization from "../PluginAuthorization";
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";
import PluginDetailsChannelsCard from "./PluginDetailsChannelsCard";
import { PluginConfiguration } from "./types";

export interface PluginDetailsPageFormData {
  active: boolean;
  configuration: ConfigurationItemInput[];
}

export interface PluginsDetailsPageProps {
  disabled: boolean;
  errors: PluginErrorFragment[];
  plugin: Plugin_plugin;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
  onSubmit: (data: PluginDetailsPageFormData) => void;
  selectedConfig?: PluginConfiguration;
  setSelectedChannelId: (channelId: string) => void;
}

const useStyles = makeStyles(
  {
    spacer: {
      gridColumnEnd: "span 2"
    }
  },
  {
    name: "PluginsDetailsPage"
  }
);

const PluginsDetailsPage: React.FC<PluginsDetailsPageProps> = ({
  disabled,
  errors,
  plugin,
  saveButtonBarState,
  onBack,
  onClear,
  onEdit,
  onSubmit,
  selectedConfig,
  setSelectedChannelId
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const initialFormData = (): PluginDetailsPageFormData => ({
    active: selectedConfig?.active,
    configuration: selectedConfig?.configuration
      ?.filter(
        field => !isSecretField(selectedConfig?.configuration || [], field.name)
      )
      .map(field => ({
        ...field,
        value: field.value || ""
      }))
  });

  const selectedChannelId = selectedConfig?.channel.id;

  return (
    <Form
      initial={initialFormData()}
      onSubmit={onSubmit}
      key={selectedChannelId}
    >
      {({ data, hasChanged, submit, set }) => {
        const onChange = (event: ChangeEvent) => {
          const { name, value } = event.target;
          const newData = {
            active: name === "active" ? value : data.active,
            configuration: data.configuration
          };

          if (newData.configuration) {
            newData.configuration.map(item => {
              if (item.name === name) {
                item.value = value;
              }
            });

            selectedConfig.configuration.map(item => {
              if (item.name === name) {
                item.value = value;
              }
            });
          }

          set(newData);
        };
        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.plugins)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage(
                {
                  defaultMessage: "{pluginName} Details",
                  description: "header"
                },
                {
                  pluginName: getStringOrPlaceholder(plugin?.name)
                }
              )}
            />
            <Grid variant="inverted">
              <div>
                <PluginDetailsChannelsCard
                  plugin={plugin}
                  selectedChannelId={selectedChannelId}
                  setSelectedChannelId={setSelectedChannelId}
                />
              </div>
              <PluginInfo
                data={data}
                description={plugin?.description || ""}
                errors={errors}
                name={plugin?.name || ""}
                onChange={onChange}
              />
              {data.configuration && (
                <>
                  <Hr className={classes.spacer} />
                  <div>
                    <Typography variant="h6">
                      {intl.formatMessage({
                        defaultMessage: "Plugin Settings",
                        description: "section header"
                      })}
                    </Typography>
                  </div>
                  <div>
                    <PluginSettings
                      data={data}
                      fields={selectedConfig?.configuration || []}
                      errors={errors}
                      disabled={disabled}
                      onChange={onChange}
                    />
                    {selectedConfig?.configuration.some(field =>
                      isSecretField(selectedConfig?.configuration, field.name)
                    ) && (
                      <>
                        <CardSpacer />
                        <PluginAuthorization
                          fields={selectedConfig?.configuration}
                          onClear={onClear}
                          onEdit={onEdit}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
PluginsDetailsPage.displayName = "PluginsDetailsPage";
export default PluginsDetailsPage;
