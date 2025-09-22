import type { ExecNode } from '../lib/explain/types'
import { Card, CardHeader, CardBody } from '@heroui/react'

function humanAccess(access?: string): string {
  const v = (access ?? '').toLowerCase()
  switch (v) {
    case 'all': return 'Full Table Scan'
    case 'ref': return 'Busca por Índice'
    case 'eq_ref': return 'Busca por Índice (Única)'
    case 'range': return 'Varredura por Intervalo'
    case 'index': return 'Varredura por Índice'
    case 'system': return 'Tabela do Sistema'
    case 'const': return 'Constante'
    default: return access ?? 'operação'
  }
}

export default function DetailsPanel({ node }: { node?: ExecNode | null }) {
  const raw = (node?.raw ?? {}) as Record<string, unknown>

  const badges: { text: string; color: string }[] = []
  if ((node?.accessType ?? '').toUpperCase() === 'ALL') badges.push({ text: 'FULL SCAN', color: 'bg-red-600' })
  if (raw.using_filesort === true) badges.push({ text: 'FILESORT', color: 'bg-amber-500' })
  if (raw.using_temporary_table === true) badges.push({ text: 'TEMP TABLE', color: 'bg-amber-500' })

  return (
    <Card shadow="sm" radius="sm" className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-0">
        <h3 className="font-semibold">Detalhes do Nó</h3>
      </CardHeader>
      <CardBody className="pt-3">
        {!node ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Selecione um nó no diagrama para ver os detalhes.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {badges.map((b, i) => (
                <span key={i} className={`text-[10px] ${b.color} text-slate-900 rounded px-2 py-0.5 font-semibold`}>
                  {b.text}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <div><strong>Tipo de Acesso:</strong> {humanAccess(node.accessType)}</div>
              <div><strong>Tabela:</strong> {node.table ?? '-'}</div>
              <div><strong>Custo (prefix_cost):</strong> {Number.isFinite(node.cost) ? node.cost.toFixed(2) : '-'}</div>
              <div><strong>Linhas Lidas (rows_examined_per_scan):</strong> {node.rowsExamined ?? '-'}</div>
              <div><strong>Linhas Produzidas (rows_produced_per_join):</strong> {node.rowsProduced ?? '-'}</div>
            </div>

            <div>
              <div className="text-xs font-semibold mb-1">JSON Bruto</div>
              <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded overflow-auto max-h-72">
{JSON.stringify(node.raw, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}