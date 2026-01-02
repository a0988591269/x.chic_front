// composables/useAdminMenu.ts
import type { NavigationMenuItem } from "@nuxt/ui";

export const useAdminMenu = () => {
  // const auth = useAuthStore(); // 直接這裡拿 user 資訊做判斷

  // 使用 computed 確保當權限變更時，選單會自動響應
  const menuItems = computed<NavigationMenuItem[][]>(() => {
    // 這裡可以加入邏輯判斷，例如：
    // const isAdmin = auth.hasRole('admin');

    return [
      [
        {
          label: "Main",
          type: "label",
        },
        {
          label: "工作台",
          icon: "i-lucide-layout-dashboard",
          to: "/admin",
        },
        {
          label: "會員管理",
          icon: "i-lucide-users",
          children: [
            {
              label: "會員列表",
              icon: "i-lucide-user",
              to: "/admin/users",
            },
            { label: "角色管理", icon: "i-lucide-key", to: "/admin/roles" },
            {
              label: "權限設定",
              icon: "i-lucide-shield",
              to: "/admin/permissions",
            },
          ],
        },
        {
          label: "訂單管理",
          icon: "i-lucide-shopping-cart",
          children: [
            { label: "所有訂單", to: "/admin/orders" },
            { label: "退款 / 爭議", to: "/admin/orders/refunds" },
          ],
        },
        {
          label: "專案管理",
          icon: "i-lucide-briefcase",
          // 範例：只有特定權限才顯示子選單
          // disabled: !auth.hasPermission('project_view'),
          children: [
            { label: "進行中", icon: "i-lucide-clock", to: "/projects/active" },
            {
              label: "已完成",
              icon: "i-lucide-check-circle",
              to: "/projects/done",
            },
          ],
        },
        {
          label: "數據分析",
          icon: "i-lucide-bar-chart-3",
          children: [
            { label: "營運總覽", to: "/admin/analytics/overview" },
            { label: "使用者行為", to: "/admin/analytics/users" },
            { label: "轉換率", to: "/admin/analytics/conversion" },
          ],
        },
      ],
      [
        {
          label: "系統設定",
          icon: "i-lucide-settings",
          children: [
            { label: "基本設定", to: "/admin/settings/general" },
            { label: "安全性", to: "/admin/settings/security" },
            { label: "通知", to: "/admin/settings/notifications" },
            { label: "API Keys", to: "/admin/settings/api" },
          ],
        },
        {
          label: "系統監控",
          icon: "i-lucide-activity",
          children: [
            { label: "操作紀錄", to: "/admin/audit-logs" },
            { label: "錯誤日誌", to: "/admin/error-logs" },
          ],
        },
      ],
    ];
  });

  return {
    menuItems,
  };
};
