import { Card } from '@mantine/core';
import { type SeatMapLayoutDto, type SeatType } from '../hooks/useSeatCRUD';

type Props = {
  layout: SeatMapLayoutDto | null;
  loading?: boolean;
};

const seatTypeInfo: Record<SeatType, { label: string; multiplier: string; color: string }> = {
  NORMAL: { label: 'Thường', multiplier: '1.0x', color: '#4a5568' },
  VIP: { label: 'VIP', multiplier: '1.2x', color: '#d4af37' },
  SWEETBOX: { label: 'Sweetbox', multiplier: '1.5x', color: '#ff69b4' },
};

export function SeatLayoutStats({ layout, loading }: Props) {
  if (loading) {
    return (
      <Card className="bg-[#131b2e] border border-[#424656]/40">
        <div className="text-center text-[#8c90a1]">Đang tải...</div>
      </Card>
    );
  }

  if (!layout) {
    return (
      <Card className="bg-[#131b2e] border border-[#424656]/40">
        <div className="text-center text-[#8c90a1]">Chưa có dữ liệu</div>
      </Card>
    );
  }

  const { stats, rowSymbols, maxSeatNumberPerRow } = layout;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#131b2e] rounded-lg p-4 border border-[#424656]/40">
        <h3 className="text-lg font-bold text-[#dae2fd] mb-2">{layout.roomName}</h3>
        <p className="text-sm text-[#8c90a1]">
          Hàng: <span className="text-[#dae2fd]">{rowSymbols.join(', ')}</span>
        </p>
        <p className="text-sm text-[#8c90a1]">
          Tối đa: <span className="text-[#dae2fd]">{maxSeatNumberPerRow} ghế/hàng</span>
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0c1219] rounded-lg p-4 border border-[#424656]/40">
          <div className="text-xs text-[#8c90a1] mb-2 uppercase font-medium">Tổng ghế</div>
          <div className="text-3xl font-bold text-[#0066ff]">{stats.totalSeats}</div>
        </div>

        <div className="bg-[#0c1219] rounded-lg p-4 border border-[#424656]/40">
          <div className="text-xs text-[#8c90a1] mb-2 uppercase font-medium">Hàng chiếu</div>
          <div className="text-3xl font-bold text-[#0066ff]">{rowSymbols.length}</div>
        </div>
      </div>

      {/* Seat Types Breakdown */}
      <div className="bg-[#131b2e] rounded-lg p-4 border border-[#424656]/40 space-y-3">
        <h4 className="text-sm font-bold text-[#dae2fd] uppercase">Phân loại ghế</h4>
        
        {Object.entries(stats)
          .filter(([key]) => key !== 'totalSeats')
          .map(([key, value]) => {
            const typeKey = key.replace('Seats', '').toUpperCase() as SeatType;
            const info = seatTypeInfo[typeKey];
            if (!info) return null;

            const percentage = stats.totalSeats > 0 
              ? ((value / stats.totalSeats) * 100).toFixed(1) 
              : '0';

            return (
              <div
                key={key}
                className="flex items-center gap-3 p-3 bg-[#0c1219] rounded-lg border border-[#424656]/40"
              >
                {/* Color dot */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: info.color }}
                />

                {/* Type info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#dae2fd]">{info.label}</div>
                  <div className="text-xs text-[#8c90a1]">{info.multiplier}</div>
                </div>

                {/* Count and percentage */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-[#dae2fd]">{value}</div>
                  <div className="text-xs text-[#8c90a1]">{percentage}%</div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Progress bars */}
      {stats.totalSeats > 0 && (
        <div className="bg-[#131b2e] rounded-lg p-4 border border-[#424656]/40 space-y-3">
          <h4 className="text-sm font-bold text-[#dae2fd] uppercase">Phân bổ</h4>
          
          {[
            { key: 'normalSeats', label: 'Thường', color: '#4a5568' },
            { key: 'vipSeats', label: 'VIP', color: '#d4af37' },
            { key: 'sweetboxSeats', label: 'Sweetbox', color: '#ff69b4' },
          ].map(({ key, label, color }) => {
            const value = stats[key as keyof typeof stats] as number;
            const percentage = (value / stats.totalSeats) * 100;

            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8c90a1]">{label}</span>
                  <span className="text-[#dae2fd] font-medium">{value} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-[#0c1219] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: color,
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="bg-[#0c1219] rounded-lg p-4 border border-[#424656]/40">
        <h4 className="text-sm font-bold text-[#dae2fd] mb-3 uppercase">Tóm tắt</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#8c90a1]">Tổng hàng:</span>
            <span className="text-[#dae2fd] font-medium">{rowSymbols.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c90a1]">Tổng ghế:</span>
            <span className="text-[#dae2fd] font-medium">{stats.totalSeats}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c90a1]">Ghế/hàng tối đa:</span>
            <span className="text-[#dae2fd] font-medium">{maxSeatNumberPerRow}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

