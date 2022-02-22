import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables,
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { useScrollToTop } from "../../lib/hooks";
import { Viewer } from "../../lib/types";
import { displaySuccessNotification } from "../../lib/utils";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const Stripe = ({ viewer, setViewer }: Props) => {
  let navigate = useNavigate();

  const [connectStripe, { data, loading, error }] = useMutation<ConnectStripeData, ConnectStripeVariables>(
    CONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.connectStripe) {
          setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully connected your Stripe Account!",
            "You can now begin to create listings in the Host page."
          );
        }
      },
    }
  );

  const connectStripeRef = useRef(connectStripe);

  useScrollToTop();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code },
        },
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (data && data.connectStripe) {
    navigate(`/user/${viewer.id}`);
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Content>
    );
  }

  if (error) {
    navigate(`/user/${viewer.id}?stripe_error=true`);
  }

  return null;
};
