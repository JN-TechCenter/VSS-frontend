import React from 'react';
import { Card, Row, Col, Statistic, Divider } from 'antd';
import { StatCardConfig } from './types';

interface StatCardProps {
  title: string;
  stats: StatCardConfig[];
  loading?: boolean;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  stats,
  loading = false,
  extra,
  footer,
  style
}) => {
  const getSpan = (statsLength: number) => {
    if (statsLength <= 2) return 12;
    if (statsLength <= 3) return 8;
    if (statsLength <= 4) return 6;
    return 4;
  };

  return (
    <Card 
      title={title} 
      extra={extra}
      loading={loading}
      style={style}
    >
      <Row gutter={16}>
        {stats.map((stat, index) => {
          const formattedValue = stat.formatter 
            ? stat.formatter(stat.value)
            : stat.value;

          return (
            <Col span={getSpan(stats.length)} key={index}>
              <div style={{ textAlign: 'center' }}>
                <Statistic
                  title={stat.title}
                  value={formattedValue}
                  valueStyle={{ 
                    color: stat.color,
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                  prefix={stat.icon}
                />
              </div>
            </Col>
          );
        })}
      </Row>
      {footer && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          {footer}
        </>
      )}
    </Card>
  );
};

export default StatCard;