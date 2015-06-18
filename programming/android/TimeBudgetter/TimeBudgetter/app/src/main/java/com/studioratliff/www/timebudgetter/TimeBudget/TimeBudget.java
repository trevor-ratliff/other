package com.studioratliff.www.timebudgetter.TimeBudget;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Trevor Ratliff on 2015-06-12.
 */
public class TimeBudget {
    /**
     * An array of time budget items.
     */
    public static List<TimeBudgetItem> ITEMS = new ArrayList<TimeBudgetItem>();

    /**
     * A map of time budget items, by ID.
     */
    public static Map<String, TimeBudgetItem> ITEM_MAP = new HashMap<String, TimeBudgetItem>();

    private static void addItem(TimeBudgetItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);
    }

    /**
     * A time budget item representing an event that you want to track.
     */
    public static class TimeBudgetItem {
        public String id;
        public String name;
        public Date dueDate;
        public String description;
        public TimeBudgetStatus status;

        public TimeBudgetItem(String id, String name, Date dueDate, String description, TimeBudgetStatus status) {
            this.id = id;
            this.name = name;
            this.dueDate = dueDate;
            this.description = description;
            this.status = status;
        }

        @Override
        public String toString() {
            return this.name + ": " + this.dueDate.toString() + " - " + this.description;
        }
    }

    /**
     * an enumeration of time budget status
     */
    public static enum TimeBudgetStatus {
        UnimportantUnurgent,
        UnimportantUrgent,
        ImportantUnurgent,
        ImportantUrgent
    }
}
