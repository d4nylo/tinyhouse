import { Card, List, Skeleton } from "antd";

import imgListingLoadingCardCover from "../../assets/listing-loading-card-cover.jpeg";

interface Props {
  numOfItems?: number;
}

export const ListingsSkeleton = ({ numOfItems }: Props) => {
  const emptyData = new Array(numOfItems ?? 8).fill({});

  return (
    <div>
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${imgListingLoadingCardCover})` }}
                  className="listings-skeleton__card-cover-img"
                />
              }
              loading
              className="listings-skeleton__card"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
