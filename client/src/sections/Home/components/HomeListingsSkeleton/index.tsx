import { Card, List, Skeleton } from "antd";

import imgListingLoadingCardCover from "../../assets/listing-loading-card-cover.jpeg";

export const HomeListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}];

  return (
    <div className="home-listings-skeleton">
      <Skeleton paragraph={{ rows: 0 }} />
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${imgListingLoadingCardCover})` }}
                  className="home-listings-skeleton__card-cover-img"
                />
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
