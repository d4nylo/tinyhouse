import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { USER } from "../../lib/graphql/queries";
import { User as UserData, UserVariables } from "../../lib/graphql/queries/User/__generated__/User";
import { Viewer } from "../../lib/types";
import { UserProfile } from "./components";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
}

export const User = ({ viewer }: Props) => {
  const { id } = useParams();

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: id || "",
    },
  });

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === id;

  const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
