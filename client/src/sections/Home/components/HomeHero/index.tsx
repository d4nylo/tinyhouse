import { Link } from "react-router-dom";
import { Card, Col, Input, Row, Typography } from "antd";

import imgDubai from "../../assets/dubai.jpeg";
import imgLondon from "../../assets/london.jpeg";
import imgLosAngeles from "../../assets/los-angeles.jpeg";
import imgToronto from "../../assets/toronto.jpeg";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">Find a place you'll love to stay at</Title>
        <Search
          placeholder="Search 'San Fransisco'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/toronto">
            <Card cover={<img alt="Toronto" src={imgToronto} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/dubai">
            <Card cover={<img alt="Dubai" src={imgDubai} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/los%20angeles">
            <Card cover={<img alt="Los Angeles" src={imgLosAngeles} />}>Los Angeles</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/london">
            <Card cover={<img alt="London" src={imgLondon} />}>London</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
