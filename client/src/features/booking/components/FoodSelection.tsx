import {
  Stack,
  Group,
  Paper,
  Text,
  Button,
  Image,
  Badge,
  ScrollArea,
  Center,
  Loader,
  Grid,
} from '@mantine/core';
import { IconShoppingCart, IconPlus, IconMinus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAvailableFoods } from '../hooks/useFood';
import type { FoodType } from '../services/food.service';
import  { useMemo } from 'react';

export interface SelectedFood {
  foodId: number;
  quantity: number;
  price: number;
  name: string;
}

type Props = {
  selectedFoods: Map<number, SelectedFood>;
  maxItems?: number;
  onFoodSelect: (food: SelectedFood) => void;
  onFoodRemove: (foodId: number, quantity: number) => void;
};

const FOOD_CATEGORY_COLORS: Record<string, string> = {
  FOOD: 'orange',
  DRINK: 'cyan',
  COMBO: 'blue',
};

const FOOD_CATEGORY_LABELS: Record<string, string> = {
  FOOD: 'Đồ Ăn',
  DRINK: 'Thức Uống',
  COMBO: 'Combo',
};

export function FoodSelection({
  selectedFoods,
  maxItems = 50,
  onFoodSelect,
  onFoodRemove,
}: Props) {
  const { data: foodsResponse, isLoading, error } = useAvailableFoods(0, 20);

  const foods = useMemo(
    () => foodsResponse?.content || [],
    [foodsResponse],
  );

  const totalFoodItems = useMemo(
    () => Array.from(selectedFoods.values()).reduce((sum, f) => sum + f.quantity, 0),
    [selectedFoods],
  );

  const handleAddFood = (food: FoodType) => {
    if (totalFoodItems >= maxItems) {
      notifications.show({
        title: 'Giới hạn đồ ăn',
        message: `Bạn chỉ có thể chọn tối đa ${maxItems} món ăn`,
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    const existingFood = selectedFoods.get(food.id);
    const newQuantity = (existingFood?.quantity || 0) + 1;

    onFoodSelect({
      foodId: food.id,
      quantity: newQuantity,
      price: food.price,
      name: food.name,
    });
  };

  const handleRemoveFood = (foodId: number) => {
    const food = selectedFoods.get(foodId);
    if (food) {
      onFoodRemove(foodId, 1);
    }
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center">
          <Loader />
          <Text size="sm" c="dimmed">
            Đang tải menu đồ ăn...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (error || !foods || foods.length === 0) {
    return (
      <Paper p="md" radius="md" bg="rgba(255, 193, 7, 0.1)" c="warning">
        <Text size="sm">Không có đồ ăn nào có sẵn lúc này</Text>
      </Paper>
    );
  }

  // Nhóm đồ ăn theo loại
  const groupedFoods = foods.reduce<Record<string, FoodType[]>>((acc, food) => {
    const type = food.type || 'SNACK';
    if (!acc[type]) acc[type] = [];
    acc[type].push(food);
    return acc;
  }, {});

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="xs">
          <IconShoppingCart size={20} />
          <Text fw={600}>
            Chọn Đồ Ăn & Thức Uống
          </Text>
        </Group>
        <Badge
          size="lg"
          variant="dot"
          color={totalFoodItems > 0 ? 'green' : 'gray'}
        >
          {totalFoodItems}/{maxItems}
        </Badge>
      </Group>

      <ScrollArea>
        <Stack gap="lg">
          {Object.entries(groupedFoods).map(([category, categoryFoods]) => (
            <div key={category}>
              <Group mb="sm">
                <Badge
                  color={FOOD_CATEGORY_COLORS[category] || 'gray'}
                  variant="light"
                >
                  {FOOD_CATEGORY_LABELS[category] || category}
                </Badge>
                <Text size="sm" c="dimmed">
                  {categoryFoods.length} món
                </Text>
              </Group>

              <Grid gutter="md">
                {categoryFoods.map((food) => {
                  const selected = selectedFoods.get(food.id);
                  const quantity = selected?.quantity || 0;

                  return (
                    <Grid.Col key={food.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Paper
                        p="md"
                        radius="md"
                        bg={quantity > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)'}
                        style={{
                          border: quantity > 0
                            ? '2px solid rgb(76, 175, 80)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Stack gap="sm">
                          {/* Hình ảnh */}
                          {food.imageUrl && (
                            <Image
                              src={food.imageUrl}
                              alt={food.name}
                              height={120}
                              radius="md"
                              fit="cover"
                            />
                          )}

                          {/* Tên và giá */}
                          <Group justify="space-between">
                            <div>
                              <Text fw={600} size="sm" lineClamp={1}>
                                {food.name}
                              </Text>
                              {food.description && (
                                <Text size="xs" c="dimmed" lineClamp={1}>
                                  {food.description}
                                </Text>
                              )}
                            </div>
                          </Group>

                          {/* Giá */}
                          <Group justify="space-between">
                            <Text
                              fw={700}
                              size="md"
                              c="var(--mantine-color-blue-4)"
                            >
                              {food.price.toLocaleString('vi-VN')}₫
                            </Text>

                            {/* Số lượng */}
                            {quantity > 0 && (
                              <Badge color="green" variant="dot">
                                x{quantity}
                              </Badge>
                            )}
                          </Group>

                          {/* Nút chọn/bỏ chọn */}
                          <Group grow>
                            {quantity > 0 ? (
                              <>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="red"
                                  leftSection={<IconMinus size={16} />}
                                  onClick={() => handleRemoveFood(food.id)}
                                >
                                  Bỏ
                                </Button>
                                <Button
                                  size="xs"
                                  variant="filled"
                                  color="green"
                                  leftSection={<IconPlus size={16} />}
                                  onClick={() => handleAddFood(food)}
                                  disabled={totalFoodItems >= maxItems}
                                >
                                  Thêm
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="xs"
                                variant="light"
                                fullWidth
                                leftSection={<IconShoppingCart size={16} />}
                                onClick={() => handleAddFood(food)}
                                disabled={totalFoodItems >= maxItems}
                              >
                                Chọn
                              </Button>
                            )}
                          </Group>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

