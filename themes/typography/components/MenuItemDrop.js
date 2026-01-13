import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export const MenuItemDrop = ({ link }) => {
  const router = useRouter()
  if (!link?.show) return null

  const hasSubMenu = (link?.subMenus?.length ?? 0) > 0
  const currentPath = (router.asPath || '').split('?')[0].split('#')[0]

  // 选中判断：自己命中 或 子菜单命中（如果不想父级联动，把最后一段去掉即可）
  const selected =
    currentPath === link.href ||
    router.pathname === link.href

  // 紧凑矩形范围（仅 hover 变色）
  const tightBox = 'px-1 py-[1px]' // 可改更紧：'px-1 py-0'

  // ✅ 仅 hover 变色：无论 active 与否，背景都不常驻；hover 时才有底色
  const boxClass = [
    'inline-flex items-center gap-2 font-bold tracking-widest transition-colors',tightBox,
    'text-[var(--primary-color)] dark:text-gray-200','hover:bg-[#2E405B] hover:text-white dark:hover:text-[var(--primary-color)] dark:hover:bg-white',
  ].join(' ')

  // Label：选中态可去下划线（如不需要，去掉 active 判断即可）
  const Label = ({ icon, text, active }) => (
    <span className="inline-flex items-center gap-2 text-current leading-none">
      {icon && (
        <i className={`${icon} fa-fw w-4 text-base shrink-0`} style={{ lineHeight: '1.3' }} aria-hidden="true" />
      )}
      <span
        className={[
          'underline decoration-1 underline-offset-2 transition-all',
        ].join(' ')}
      >
        {text}
      </span>
    </span>
  )

  return (
    <div className="menu-item relative">
      {/* ===== 无子菜单：与有子菜单一致的紧凑布局 ===== */}
      {!hasSubMenu && (
        <div className="flex items-center">
          <SmartLink href={link.href} target={link.target} className={boxClass}>
            <Label icon={link.icon} text={link.name} active={selected} />
          </SmartLink>
        </div>
      )}

      {/* ===== 有子菜单 ===== */}
      {hasSubMenu && (
        // ✅ group 放在共同父级，保证 group-hover 能影响到 ul
        <div className="relative group">
          {/* 父级一行：高亮块（仅 hover 变色） + 箭头（不进高亮范围） */}
          <div className="flex items-center">
            <div className={boxClass}>
              <Label icon={link.icon} text={link.name} active={selected} />
            </div>

            {/* 箭头放在父级与子级“中间”，hover 箭头也能展开 */}
            <i
              className="fas fa-chevron-right ml-1 text-sm transition-transform duration-500 group-hover:rotate-180"
              aria-hidden="true"
            />
          </div>

          {/* 子菜单：仅 hover 显示（父级 .group 控制） */}
          <ul className="absolute glassmorphism md:left-28 md:top-0 top-6 w-full border-gray-100 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-20 space-y-2">
            {link.subMenus.map((sLink) => {
              const childSelected = currentPath === sLink.href
              return (
                <li
                  key={sLink.href}
                  className="tracking-widest py-0 transition-all duration-200 dark:border-gray-800 dark:hover:bg-gray-900"
                >
                  <SmartLink
                    href={sLink.href}
                    target={link.target}
                    className={[
                      'inline-flex items-center gap-2 font-bold tracking-widest transition-colors',tightBox,
                      'text-[var(--primary-color)] dark:text-gray-200','hover:bg-[#2E405B] hover:text-white dark:hover:text-[var(--primary-color)] dark:hover:bg-white',
                    ].join(' ')}
                  >
                    {sLink.icon && (
                      <i
                        className={`${sLink.icon} fa-fw w-4 text-base shrink-0`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={[
                        'decoration-1 underline-offset-2 transition-all','underline hover:no-underline',
                      ].join(' ')}
                    >
                      {sLink.title}
                    </span>
                  </SmartLink>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}